# Weather Forecast App
#### Feito para fins educacionais
Aplicação web em **React** que exibe o clima atual, qualidade do ar e previsão para 5 dias de qualquer cidade usando a **API do OpenWeatherMap**.


##  Funcionalidades
- Buscar cidade pelo nome.
- Exibir clima atual: temperatura, umidade e vento.
- Exibir qualidade do ar (AQI e poluentes).
- Previsão para os próximos 5 dias, com ícones e temperatura.


## Tecnologias
- React
- TailwindCSS
- Axios
- OpenWeatherMap API

## Requisitos
- Node.js (para desenvolvimento)
- Docker (para rodar em container)
- Chave da API do OpenWeatherMap

## Rodando via Docker

O Dockerfile permite que qualquer usuário rode o app em produção sem precisar instalar Node localmente.

### Passo a passo

1. Clonar o repositório:
```bash
git clone https://github.com/mhenriquecode/WeatherForecast
```
2. Buildar a imagem Docker passando sua chave da API:
- Crie Uma conta na OpenWeather e pegue sua chave: https://openweathermap.org/
- Execute o build do projeto inserindo sua chave em 'SUA_CHAVE' no comando docker build:
```bash
docker build --build-arg VITE_WEATHER_API_KEY=SUA_CHAVE -t weather-app .
```
> A chave será embutida na build. Cada usuário deve usar sua própria chave.

3. Rodar o container:

```bash
docker run -p 8080:80 weather-app
```

4. Abrir no navegador:

```
http://localhost:8080
```
## Layout
<img width="1250" height="870" alt="image" src="https://github.com/user-attachments/assets/96559dfe-96f1-4fef-b3de-e1ff49ac2200" />
