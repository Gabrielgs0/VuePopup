# VuePopup

## Tabela de Conteúdos

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Uso](#uso)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Visão Geral

Uma breve descrição do projeto, destacando sua finalidade e principais recursos. Inclua capturas de tela ou gifs animados, se aplicável. Explique o contexto do projeto, as motivações por trás dele e qualquer informação relevante que ajude os usuários a entenderem o propósito do projeto.

## Instalação

Descreva os passos necessários para instalar o projeto localmente. Inclua os comandos para instalar as dependências e configurar qualquer ambiente necessário. Certifique-se de fornecer informações claras e concisas para que os usuários possam reproduzir o ambiente de desenvolvimento.

Exemplo:

1. Clone o repositório: ### git clone https://github.com/Gabrielgs0/VuePopup.git
2. Instale as dependências: ### yarn install
3. Configure as variáveis de ambiente: ### caso seja necessario
4. Inicie o servidor de desenvolvimento: ### yarn serve


O projeto estará disponível em `http://localhost:8080`.

## Uso

Ao iniciar o navegador o Popup sera exibido após um atraso de 1 segundo quando o componente for montado,
preencha os formularios e click em girar, em seguida a animação ocorrera e sorteara um desconto aleatorio,
você recebera a mensagem com o desconto adquirido.
as configurações disponiveis no JSON são as seguintes:

## escolher inputs:
```
"formData": [
    { "placeholder": "Email", "type": "email", "id": "email", "value": "" },
    { "placeholder": "Nome", "type": "text", "id": "name", "value": "" },
    { "placeholder": "Telefone: (xx) xxxxx-xxxx", "type": "tel", "id": "phone", "value": "" },
    { "placeholder": "Gênero ex: Masculino", "type": "text", "id": "genero", "value": "" }
  ],
```
## escolher popup. as opções são "jogo" ou "video"
```
"backgroundType": "jogo" ou "backgroundType": "video"
```
## usar ou não checkbox: as opções são true para usar ou false para não usar
```
"showCheckbox": true ou "showCheckbox": false
```

## Tecnologias Utilizadas

- Vue.js
- JavaScript
- CSS Scoped
- JSON
