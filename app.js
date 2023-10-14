import getLocalIp from 'local-ip';
import { LocalNetwork } from './own_modules/local-network.js';


const Interface = 'eno1';
const MyLocalNetwork = {
    ipAddress: getLocalIp(Interface),
    mask: "255.255.255.0",
};

const network = new LocalNetwork (MyLocalNetwork.ipAddress, MyLocalNetwork.mask);
network.initHosts()
    .then((net) => {
        net.getHosts()
            .then( r => console.log("HOSTS :",r) );

        net.getIpAddressFor('MAC_ADDRESS')
            .then( (r) => console.log( "IP ADDRESS OF "+r.macAddress+" IS "+r.ipAddress) );

        net.getMacAddressFor('IP_ADDRESS')
            .then( (r) => console.log( "MAC ADDRESS OF "+r.ipAddress+" IS "+r.macAddress) );
    });
