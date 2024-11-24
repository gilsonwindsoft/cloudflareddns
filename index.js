const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.CLOUDFLARE_API_KEY;
const DOMAINS = process.env.DOMAINS.split(',');
const ARECORDS = process.env.ARECORDS.split(',');

const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4';

let currentIP = null;

async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Erro ao obter o IP público:', error.message);
        return null;
    }
}

async function getZoneID(domain) {
    try {
        console.log("getZoneID: "+domain)
        const response = await axios.get(`${CLOUDFLARE_API_URL}/zones`, {
            headers: {
                'Authorization': "Bearer "+API_KEY,
            },
            params: { name: domain },
        });

        if (response.data.success && response.data.result.length > 0) {
            return response.data.result[0].id;
        }
    } catch (error) {
        console.error(`Erro ao obter o Zone ID para ${domain}:`, error.message);
    }
    return null;
}

async function getDNSRecordID(zoneID, domain) {
    try {
        const response = await axios.get(`${CLOUDFLARE_API_URL}/zones/${zoneID}/dns_records`, {
            headers: {
                'Authorization': "Bearer "+API_KEY,
            },
            params: { name: domain },
        });

        if (response.data.success && response.data.result.length > 0) {
            return response.data.result[0].id;
        }
    } catch (error) {
        console.error(`Erro ao obter o DNS Record ID para ${domain}:`, error.message);
    }
    return null;
}

async function updateDNSRecord(zoneID, recordID, domain, ip) {
    try {
        const response = await axios.put(
            `${CLOUDFLARE_API_URL}/zones/${zoneID}/dns_records/${recordID}`,
            {
                type: 'A',
                name: domain,
                content: ip,
            },
            {
                headers: {
                    'Authorization': "Bearer "+API_KEY,
                },
            }
        );

        if (response.data.success) {
            console.log(`DNS atualizado para ${domain}: ${ip}`);
        } else {
            console.error(`Erro ao atualizar DNS para ${domain}:`, response.data.errors);
        }
    } catch (error) {
        console.error(`Erro ao atualizar DNS para ${domain}:`, error.message);
    }
}

async function updateDomains() {
    const publicIP = await getPublicIP();

    if (!publicIP) {
        console.error('IP público não obtido. Tentando novamente mais tarde...');
        return;
    }

    if (currentIP === publicIP) {
        console.log('IP público não mudou. Nenhuma atualização necessária.');
        return;
    }

    console.log(`IP público mudou para ${publicIP}. Atualizando registros DNS...`);

    for (const domain of DOMAINS) {
        const zoneID = await getZoneID(domain);
        if (!zoneID) continue;

        for (const arecord of ARECORDS){
            const recordID = await getDNSRecordID(zoneID, arecord);
            if (!recordID) continue;
    
            await updateDNSRecord(zoneID, recordID, arecord, publicIP);
        }
    }

    currentIP = publicIP;
}

async function startDDNS() {
    console.log('Iniciando serviço DDNS...');
    await updateDomains();
    setInterval(updateDomains, 300000); // Verifica a cada 5 minutos
}

startDDNS().catch((error) => {
    console.error('Erro crítico:', error.message);
});
