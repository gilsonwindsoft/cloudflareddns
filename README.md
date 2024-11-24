# Documentação do Projeto (README)

---

## Dynamic DNS Updater com Cloudflare (Português/English)

Este projeto é um script Node.js que atua como um atualizador dinâmico de DNS (DDNS), utilizando a API da Cloudflare. O script atualiza automaticamente registros DNS do tipo `A` quando o IP público do servidor muda, garantindo que os domínios apontem para o IP correto.

---

### Requisitos

#### Pré-requisitos

- Node.js instalado na máquina.
- Conta configurada no Cloudflare com a API Key gerada.
- Domínios gerenciados pela Cloudflare.
- Variáveis de ambiente configuradas em um arquivo `.env`.

---

### Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd <NOME_DO_REPOSITÓRIO>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```env
   CLOUDFLARE_API_KEY=SuaChaveDeAPICloudflare
   DOMAINS=dominio1.com,dominio2.com
   ARECORDS=www.dominio1.com,api.dominio2.com
   ```

   - **CLOUDFLARE_API_KEY**: Chave de API gerada na sua conta Cloudflare.
   - **DOMAINS**: Lista de domínios gerenciados pela Cloudflare, separados por vírgulas.
   - **ARECORDS**: Lista de subdomínios cujos registros DNS serão atualizados, separados por vírgulas.

4. Execute o script:
   ```bash
   node index.js
   ```

---

### Funcionamento

1. **Obtenção do IP Público**:
   O script usa o serviço `https://api.ipify.org` para obter o IP público atual.

2. **Integração com Cloudflare**:
   - Obtém o Zone ID de cada domínio fornecido.
   - Identifica o ID dos registros DNS do tipo `A` a serem atualizados.
   - Atualiza os registros DNS com o novo IP público.

3. **Execução Contínua**:
   - O script executa uma verificação inicial para atualizar os registros DNS, caso necessário.
   - Após a primeira execução, verifica a cada 5 minutos se o IP público mudou.

---

### Logs

O script gera logs para facilitar o acompanhamento das atividades:
- IP público obtido ou erro durante a obtenção.
- Atualizações realizadas nos registros DNS.
- Erros de comunicação com a API da Cloudflare.

---

### Licença

Este projeto é disponibilizado sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

---

## Dynamic DNS Updater with Cloudflare (English)

This project is a Node.js script that functions as a Dynamic DNS (DDNS) updater, using the Cloudflare API. It automatically updates `A` records whenever the server's public IP changes, ensuring the domains always point to the correct IP.

---

### Requirements

#### Prerequisites

- Node.js installed on the machine.
- Configured Cloudflare account with a generated API Key.
- Domains managed by Cloudflare.
- Environment variables set up in a `.env` file.

---

### Installation

1. Clone the repository:
   ```bash
   git clone <REPOSITORY_URL>
   cd <REPOSITORY_NAME>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the `.env` file:
   Create a `.env` file in the project root with the following content:

   ```env
   CLOUDFLARE_API_KEY=YourCloudflareAPIKey
   DOMAINS=domain1.com,domain2.com
   ARECORDS=www.domain1.com,api.domain2.com
   ```

   - **CLOUDFLARE_API_KEY**: API Key generated from your Cloudflare account.
   - **DOMAINS**: List of domains managed by Cloudflare, separated by commas.
   - **ARECORDS**: List of subdomains whose DNS records will be updated, separated by commas.

4. Run the script:
   ```bash
   node index.js
   ```

---

### How It Works

1. **Fetch Public IP**:
   The script uses `https://api.ipify.org` to fetch the current public IP.

2. **Cloudflare Integration**:
   - Fetches the Zone ID for each specified domain.
   - Identifies the ID of `A` DNS records to be updated.
   - Updates the DNS records with the new public IP.

3. **Continuous Execution**:
   - The script performs an initial check to update DNS records if necessary.
   - After the first run, it checks every 5 minutes for public IP changes.

---

### Logs

The script generates logs to facilitate activity tracking:
- Public IP fetched or errors during fetching.
- Updates made to DNS records.
- Errors communicating with the Cloudflare API.

---

### License

This project is licensed under the MIT License. See the `LICENSE` file for details.

# Adicionando Execução Contínua com PM2

---

### Mantendo o Script Sempre Ativo com PM2

O PM2 é um gerenciador de processos para Node.js que facilita a execução contínua de aplicações, permitindo que elas permaneçam ativas mesmo após um reinício do servidor.

Abaixo estão as instruções para instalar e configurar o PM2 para manter o script de DDNS ativo:

---

### Instalação do PM2

1. Instale o PM2 globalmente:
   ```bash
   npm install -g pm2
   ```

2. Verifique a instalação do PM2:
   ```bash
   pm2 --version
   ```
   Certifique-se de que o comando acima retorna a versão instalada do PM2.

---

### Configuração do Script com PM2

1. Inicie o script usando o PM2:
   ```bash
   pm2 start index.js --name ddns-updater
   ```

   - **`index.js`**: O nome do arquivo principal do script.
   - **`--name ddns-updater`**: Um nome amigável para identificar o processo.

2. Confirme que o script está sendo executado:
   ```bash
   pm2 list
   ```
   Esse comando exibirá uma lista de processos gerenciados pelo PM2, incluindo o `ddns-updater`.

3. Configure o PM2 para reiniciar automaticamente após um reboot do servidor:
   ```bash
   pm2 startup
   ```
   O comando acima gerará um comando adicional específico para o sistema operacional. Copie e execute o comando gerado.

4. Salve a configuração atual do PM2 para que os processos sejam restaurados após o reinício:
   ```bash
   pm2 save
   ```

---

### Monitoramento e Gerenciamento

1. Verifique os logs do script:
   ```bash
   pm2 logs ddns-updater
   ```

2. Reinicie o processo, se necessário:
   ```bash
   pm2 restart ddns-updater
   ```

3. Pare o processo:
   ```bash
   pm2 stop ddns-updater
   ```

4. Exclua o processo do PM2:
   ```bash
   pm2 delete ddns-updater
   ```

---

### Benefícios do PM2

- **Auto-Restart**: O PM2 reinicia automaticamente o script caso ele falhe.
- **Logs Centralizados**: Todos os logs gerados pelo script podem ser visualizados e gerenciados pelo PM2.
- **Persistência**: Os scripts gerenciados pelo PM2 continuam ativos mesmo após reinicializações do servidor.

---

Essa configuração garante que o script de DDNS esteja sempre em execução, mantendo os registros DNS atualizados continuamente e sem a necessidade de intervenção manual.
