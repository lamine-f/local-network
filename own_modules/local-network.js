import { IpRange } from './ip-range.js';
import  arp  from 'node-arp';
import pkg2 from 'ping';
const ping = pkg2.sys.probe;


export class LocalNetwork {

    constructor ( ipAddress, mask ) {
        this.ipAddress = ipAddress;
        this.mask = mask;
        this.hosts = null;
    }

    async initHosts () {
        this.hosts = [];
        let ipAlive = 0;
        let macAlive = 0;
        this.hosts = await new Promise( (resolve, reject) =>
            new IpRange( this.ipAddress, this.mask)
                .res.getRange()
                    .forEach(hosts => 
                        hosts.forEach((host) => {
                            ping(host, (isAlive) => {
                                if (isAlive) {
                                    ipAlive++;
                                    arp.getMAC(host, (err, mac) => {
                                        macAlive++;
                                        this.hosts.push({
                                            ipAddress: host,
                                            macAddress: String(mac).toUpperCase()
                                        });
                                        
                                        if ( macAlive == ipAlive ){
                                            resolve(this.hosts);
                                        }
                                    });
                                }
                            })
                        })
                    )   
        );
        return this
    }

    async getIpAddressFor (macAddress) {
        if (!this.hosts)
            await this.initHosts();
        return this.hosts.filter( (host) => host.macAddress == macAddress.toUpperCase() )[0];
    }
    
    async getMacAddressFor (ipAddress) {
        if (!this.hosts)
            await this.initHosts();
        return this.hosts.filter( (host) => host.ipAddress == ipAddress.toUpperCase() )[0];
    }

    async getHosts () {
        if (!this.hosts)
            await this.initHosts();
        return this.hosts;
    }
}

