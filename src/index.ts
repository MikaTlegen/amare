import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 3000);

// Минимальный сервер: только проверка живости для Docker
const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  // Всё, что не открыто явно, закрыто
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

// Корректная остановка контейнера
process.on("SIGTERM", () => {
  console.log("Получен SIGTERM, останавливаю сервер");
  server.close(() => process.exit(0));
});
