"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    if (process.env.NODE_ENV === 'production') {
        const clientBuildPath = (0, path_1.join)(__dirname, '..', 'client', 'dist');
        app.useStaticAssets(clientBuildPath);
        const express = app.getHttpAdapter().getInstance();
        express.get('*', (req, res, next) => {
            if (req.url && req.url.startsWith('/api')) {
                return next();
            }
            res.sendFile((0, path_1.join)(clientBuildPath, 'index.html'));
        });
    }
    const PORT = process.env.PORT || 5000;
    await app.listen(PORT);
    console.log(`Server started on port ${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map