"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryController = void 0;
const common_1 = require("@nestjs/common");
const library_service_1 = require("./library.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const library_model_1 = require("../models/library.model");
let LibraryController = class LibraryController {
    constructor(libraryService) {
        this.libraryService = libraryService;
    }
    async getLibrary(user, type) {
        return this.libraryService.getLibrary(user.id, type);
    }
    async addToLibrary(user, body) {
        return this.libraryService.addToLibrary(user.id, body.itemType, body.itemId, body.notes);
    }
    async removeFromLibrary(user, type, id) {
        await this.libraryService.removeFromLibrary(user.id, type, parseInt(id, 10));
        return { message: 'Item removed from library' };
    }
    async updateNotes(user, type, id, body) {
        return this.libraryService.updateNotes(user.id, type, parseInt(id, 10), body.notes);
    }
    async checkInLibrary(user, type, id) {
        const isInLibrary = await this.libraryService.isInLibrary(user.id, type, parseInt(id, 10));
        return { isInLibrary };
    }
};
exports.LibraryController = LibraryController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getLibrary", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "addToLibrary", null);
__decorate([
    (0, common_1.Delete)(':type/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "removeFromLibrary", null);
__decorate([
    (0, common_1.Put)(':type/:id/notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "updateNotes", null);
__decorate([
    (0, common_1.Get)('check/:type/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "checkInLibrary", null);
exports.LibraryController = LibraryController = __decorate([
    (0, common_1.Controller)('api/library'),
    __metadata("design:paramtypes", [library_service_1.LibraryService])
], LibraryController);
//# sourceMappingURL=library.controller.js.map