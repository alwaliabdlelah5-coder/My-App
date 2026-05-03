import { Router, type IRouter, type Request, type Response } from "express";

export interface QueueItem {
  id: string;
  patientId?: string;
  patientName: string;
  doctorName?: string;
  type?: string;
  status: "waiting" | "in_progress" | "completed" | "cancelled";
  priority: number;
  createdAt: string;
  startTime?: string;
}

let store: QueueItem[] = [];

const sseClients = new Set<Response>();

function broadcast(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const router: IRouter = Router();

router.get("/queue/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  sseClients.add(res);

  res.write(`event: snapshot\ndata: ${JSON.stringify(store)}\n\n`);

  const keepalive = setInterval(() => {
    try {
      res.write(": keepalive\n\n");
    } catch {
      clearInterval(keepalive);
    }
  }, 20000);

  req.on("close", () => {
    clearInterval(keepalive);
    sseClients.delete(res);
  });
});

router.get("/queue", (_req: Request, res: Response) => {
  res.json(store);
});

router.post("/queue", (req: Request, res: Response) => {
  const { patientId, patientName, doctorName, type, priority } = req.body as Partial<QueueItem>;
  if (!patientName) {
    res.status(400).json({ error: "patientName is required" });
    return;
  }
  const item: QueueItem = {
    id: uid(),
    patientId,
    patientName,
    doctorName,
    type: type || "كشف",
    status: "waiting",
    priority: (priority as number) || 1,
    createdAt: new Date().toISOString(),
  };
  store.push(item);
  broadcast("added", item);
  res.status(201).json(item);
});

router.patch("/queue/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: QueueItem["status"] };
  const idx = store.findIndex((item) => item.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Queue item not found" });
    return;
  }
  store[idx] = {
    ...store[idx],
    status,
    ...(status === "in_progress" ? { startTime: new Date().toISOString() } : {}),
  };
  broadcast("updated", store[idx]);
  res.json(store[idx]);
});

router.delete("/queue/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  store = store.filter((item) => item.id !== id);
  broadcast("deleted", { id });
  res.json({ success: true });
});

export default router;
