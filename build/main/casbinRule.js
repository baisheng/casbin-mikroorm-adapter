"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinRule = void 0;
const core_1 = require("@mikro-orm/core");
// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
let CasbinRule = class CasbinRule extends core_1.BaseEntity {
};
__decorate([
    (0, core_1.SerializedPrimaryKey)()
], CasbinRule.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "ptype", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "v0", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "v1", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "v2", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "v3", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "v4", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "v5", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinRule.prototype, "v6", void 0);
CasbinRule = __decorate([
    (0, core_1.Entity)()
], CasbinRule);
exports.CasbinRule = CasbinRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzYmluUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYXNiaW5SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBDQUFpRztBQUdqRyxnRkFBZ0Y7QUFHaEYsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVyxTQUFRLGlCQUE0QjtDQTJCM0QsQ0FBQTtBQXpCQztJQURDLElBQUEsMkJBQW9CLEdBQUU7c0NBQ1g7QUFHWjtJQURDLElBQUEsZUFBUSxHQUFFO3lDQUNVO0FBR3JCO0lBREMsSUFBQSxlQUFRLEdBQUU7c0NBQ087QUFHbEI7SUFEQyxJQUFBLGVBQVEsR0FBRTtzQ0FDTztBQUdsQjtJQURDLElBQUEsZUFBUSxHQUFFO3NDQUNPO0FBR2xCO0lBREMsSUFBQSxlQUFRLEdBQUU7c0NBQ087QUFHbEI7SUFEQyxJQUFBLGVBQVEsR0FBRTtzQ0FDTztBQUdsQjtJQURDLElBQUEsZUFBUSxHQUFFO3NDQUNPO0FBR2xCO0lBREMsSUFBQSxlQUFRLEdBQUU7c0NBQ087QUExQlAsVUFBVTtJQUR0QixJQUFBLGFBQU0sR0FBRTtHQUNJLFVBQVUsQ0EyQnRCO0FBM0JZLGdDQUFVIn0=