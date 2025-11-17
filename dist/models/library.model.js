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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = exports.LibraryItemType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
var LibraryItemType;
(function (LibraryItemType) {
    LibraryItemType["PLAYER"] = "player";
    LibraryItemType["HERO"] = "hero";
    LibraryItemType["MATCH"] = "match";
})(LibraryItemType || (exports.LibraryItemType = LibraryItemType = {}));
let Library = class Library extends sequelize_typescript_1.Model {
};
exports.Library = Library;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Library.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], Library.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Library.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(LibraryItemType)),
        allowNull: false,
        field: 'item_type',
    }),
    __metadata("design:type", String)
], Library.prototype, "itemType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        field: 'item_id',
        comment: 'account_id for players, hero_id for heroes, match_id for matches',
    }),
    __metadata("design:type", Number)
], Library.prototype, "itemId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'item_name',
        comment: 'Cached name for quick display (player name, hero name, match title)',
    }),
    __metadata("design:type", String)
], Library.prototype, "itemName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'metadata',
        comment: 'Additional metadata (player rank, hero stats, match details)',
    }),
    __metadata("design:type", Object)
], Library.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        field: 'notes',
        comment: 'User notes about this item',
    }),
    __metadata("design:type", String)
], Library.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], Library.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], Library.prototype, "updatedAt", void 0);
exports.Library = Library = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'library',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                name: 'unique_user_item',
                fields: ['user_id', 'item_type', 'item_id'],
            },
        ],
    })
], Library);
//# sourceMappingURL=library.model.js.map