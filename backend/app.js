import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectFolder = path.join(import.meta.dirname, '..');
const port = 3000;

// TODO: 라우트 테이블 채우기
const routes = {
    '/': ['frontend', 'html', 'homepage.html'],
    '/css/homepage.css': ['frontend', 'css', 'homepage.css'],

    // 권민재 라우트 테이블
    // '/###': ['frontend', 'html', 'CV', '###.html'],
    // '/css/###.css': ['frontend', 'css', '###.css'],

    // 서정훈 라우트 테이블
    '/Seo-JeongHun': ['frontend', 'html', 'CV', 'Seo-JeongHun.html'],
    '/css/Seo-JeongHun.css': ['frontend', 'css', 'Seo-JeongHun.css'],

    // 정윤우 라우트 테이블
    // '/###': ['frontend', 'html', 'CV', '###.html'],
    // '/css/###.css': ['frontend', 'css', '###.css'],

    // 최현민 라우트 테이블
    // '/###': ['frontend', 'html', 'CV', '###.html'],
    // '/css/###.css': ['frontend', 'css', '###.css'],
};

const contentTypes = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
};

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=UTF-8', 'Allow': 'GET, HEAD' });
        res.end('Method Not Allowed');
        return;
    }

    const pathname = new URL(req.url, 'http://localhost').pathname;
    const route = routes[pathname];
    if (!route) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('Not Found');
        return;
    }

    const fileDir = path.join(projectFolder, ...route);
    fs.readFile(fileDir).then((data) => {
        const contentType = contentTypes[path.extname(fileDir)] ?? 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    }).catch((e) => {
        console.error(e);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('Internal Server Error');
    });
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`${port}번 포트가 이미 사용 중입니다. 실행 중인 서버를 종료하세요.`);
        return;
    }
    throw e;
});

server.listen(port, () => console.log(`서버 가동: http://localhost:${port}`));
