"""本地 API 代理：解决浏览器 CORS 限制。用法：python api-proxy.py"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.error

PORT = 8765
UPSTREAM = "https://api.deepseek.com"


class ProxyHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if not self.path.startswith("/v1/"):
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        url = UPSTREAM + self.path

        req = urllib.request.Request(
            url,
            data=body,
            headers={
                "Content-Type": self.headers.get("Content-Type", "application/json"),
                "Authorization": self.headers.get("Authorization", ""),
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
                self.send_response(resp.status)
                self._cors()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            err = e.read()
            self.send_response(e.code)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(err)


if __name__ == "__main__":
    print(f"代理已启动: http://127.0.0.1:{PORT}/v1")
    print("在 HTML 设置里把 API 地址改为上述地址，Key 填 DeepSeek 的 sk-...")
    HTTPServer(("127.0.0.1", PORT), ProxyHandler).serve_forever()
