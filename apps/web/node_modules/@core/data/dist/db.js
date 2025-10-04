"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.GRDB = void 0;
var dexie_1 = require("dexie");
var GRDB = /** @class */ (function (_super) {
    __extends(GRDB, _super);
    function GRDB() {
        var _this = _super.call(this, "gestor_reparaciones") || this;
        _this.version(1).stores({
            clientes: "id, nombre, telefono, email, fecha_alta",
            categorias_aparatos: "id, nombre, activo",
            aparatos: "id, cliente_id, categoria_id, marca, modelo, numero_serie",
            ordenes: "id, aparato_id, codigo_orden, estado, fecha_creacion",
            inspecciones: "id, orden_id",
            presupuestos: "id, orden_id",
            piezas: "id, orden_id, estado",
            progresos: "id, orden_id, fecha",
            componentes_reemplazados: "id, orden_id",
            facturas: "id, orden_id, numero_factura",
            pagos: "id, factura_id",
            ajustes: "id"
        });
        return _this;
    }
    return GRDB;
}(dexie_1.default));
exports.GRDB = GRDB;
exports.db = new GRDB();



