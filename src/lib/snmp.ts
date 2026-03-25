import snmp from 'net-snmp';

/**
 * Helper para monitoreo de RouterOS vía SNMP
 */
export async function getRouterUptimeAndCpu(ipAddress: string, community = 'public') {
  return new Promise((resolve, reject) => {
    const session = snmp.createSession(ipAddress, community);
    
    // OIDs típicos de Mikrotik/Standard
    // 1.3.6.1.2.1.1.3.0 sysUpTime
    // 1.3.6.1.2.1.25.3.3.1.2.1 hrProcessorLoad
    const oids = ["1.3.6.1.2.1.1.3.0", "1.3.6.1.2.1.25.3.3.1.2.1"];
    
    session.get(oids, function (error, varbinds) {
      if (error) {
        reject(error);
      } else {
        const result: any = {};
        for (let i = 0; i < varbinds.length; i++) {
          if (snmp.isVarbindError(varbinds[i])) {
            reject(snmp.varbindError(varbinds[i]));
            return;
          } else {
            if (varbinds[i].oid === "1.3.6.1.2.1.1.3.0") {
              result.uptime = Number(varbinds[i].value); // timeticks
            }
            if (varbinds[i].oid === "1.3.6.1.2.1.25.3.3.1.2.1") {
              result.cpu = Number(varbinds[i].value);
            }
          }
        }
        session.close();
        resolve(result);
      }
    });
  });
}
