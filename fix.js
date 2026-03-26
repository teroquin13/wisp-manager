const fs = require('fs');
function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/await params/g, 'await context.params');
  fs.writeFileSync(file, content);
}
fix('src/app/api/clientes/[id]/route.ts');
fix('src/app/api/facturacion/facturas/[id]/route.ts');
fix('src/app/api/facturacion/pagos/[id]/route.ts');
fix('src/app/api/red/contratos/[id]/route.ts');
fix('src/app/api/red/planes/[id]/route.ts');
fix('src/app/api/red/routers/[id]/route.ts');
