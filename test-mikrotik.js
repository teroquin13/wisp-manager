const { RouterOSClient } = require("routeros-client");

async function run() {
  const client = new RouterOSClient({
    host: "45.225.224.233",
    user: "tero",
    password: "terokin13",
    port: 60000
  });

  try {
    console.log("Conectando al router...");
    const conn = await client.connect();
    console.log("Obteniendo /system/identity...");
    
    // Some libraries use conn.menu, wait, the `routeros-client` API is conn.menu('/...').get()
    const identityMenu = conn.menu('/system/identity');
    const identity = await identityMenu.get();
    
    console.log("Identidad:", identity);
    conn.close();
  } catch(e) {
    console.error("Error:", e.message || String(e));
  }
}

run();
