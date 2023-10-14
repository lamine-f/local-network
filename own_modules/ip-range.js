export class IpRange {

    constructor (ip, mask) {
        this.ip = ip;
        this.mask = mask;
        this.res = this.init(this.ip, this.mask);
    }

    init (v_ip, v_mask) {

        const {ip, mask} = this.getBinaryValue(v_ip, v_mask);

        for (let i=0; i<4; i++){
            let binary_ip = ip[i].binary
            let decimal_ip = ip[i].decimal
            let binary_mask = mask[i].binary
            let decimal_mask = mask[i].decimal

            if (decimal_mask == 255){
                ip[i].min = parseInt(ip[i].decimal)
                ip[i].max = parseInt(ip[i].decimal)
            }else if (decimal_mask == 0){
                ip[i].min = 1
                ip[i].max = 254
            }else{
                let res = '';
                
                for (let j=0; j<8; j++){
                    let maskBit = binary_mask.charAt(j);
                    let ipBit = binary_ip.charAt(j);
                    if (maskBit == 1){
                        res+=ipBit
                    }else{
                        res+='0'
                    }
                }
                
                ip[i].min = parseInt(res, 2)
                ip[i].max = parseInt("254")
            }

        }

        const getRange = () => {

            const res = []

            const ip1 = [];
            for (let i=ip[0].min; i<ip[0].max+1; i++){
                ip1.push(i.toString())
            }

            const ip2 = [];
            for (let i=ip[1].min; i<ip[1].max+1; i++){
                ip2.push(i.toString())
            }

            const ip3 = [];
            for (let i=ip[2].min; i<ip[2].max+1; i++){
                ip3.push(i.toString())
            }

            const ip4 = [];
            for (let i=ip[3].min; i<ip[3].max+1; i++){
                ip4.push(i.toString())
            }

            ip1.map(value => {
                let tmp1 = value
                ip2.map(value => {
                    let tmp2 = tmp1+'.'+value
                    ip3.map(value => {
                        let tmp3 = tmp2+'.'+value
                        ip4.map(value => {
                            let tmp4 = tmp3+'.'+value
                            res.push(tmp4)
                        })
                    })
                })
            })

            const res2 = [];
            const chunkSize = 254;
            for (let i = 0; i < res.length; i += chunkSize) {
                const chunk = res.slice(i, i + chunkSize);
                // do whatever
                res2.push(chunk);
            }

            return res2;
        }

        return {ip, mask, getRange}

    }

    getBinaryValue (ip, mask) {
    
        const ipSplited = ip.split(".")
        const IP = ipSplited.map((value) => {
            return {decimal: value,binary: this.to8bit(parseInt(value).toString(2)), min: 0, max:0}
        });
    
        const maskSplited = mask.split(".")
        const MASK = maskSplited.map((value) => {
            return {decimal: value,binary: this.to8bit(parseInt(value).toString(2))}
        });
    
        return {ip: IP, mask: MASK}
    }

    to8bit (value) {
        let res = value;
        for(let i=0; i<8-value.length; i++)
            res='0'+res;
    
        return res;
    }
}

