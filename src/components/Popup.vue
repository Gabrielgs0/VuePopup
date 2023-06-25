<template>
  <div>
    <div class="popup" v-if="isPopupVisible">
      <div class="popup-content">
        <button class="close-button" @click="closePopup">X</button>
        <h2 class="popup-title">{{ getPopupTitle }}</h2>
        <h3 class="popup-subtitle">{{ getPopupSubtitle }}</h3>
        <div v-if="backgroundType === 'jogo'" class="background-popup" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"></div>
        <div v-else class="background-popup" id="background-video">
          <iframe
            width="100%"
            height="100%"
            :src="'https://www.youtube.com/embed/' + getVideoId(videoUrl) + '?autoplay=1'"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <div v-if="backgroundType === 'jogo'" class="slot-machine">
          <div class="reels">
            <div class="reel" v-for="(reel, index) in reels" :key="index">
              <div class="symbol-container">
                <img
                  :src="getSymbolImage(reel)"
                  alt="Symbol"
                  class="symbol"
                  :class="{ 'spinning': isSpinning }"
                  :style="{ 'animation-delay': spinning ? (index * 1.6) + 's' : '0s' }"
                />
              </div>
            </div>
          </div>
        </div>

        <form :class="{'video-form': backgroundType === 'video'}" @submit.prevent="submitForm" class="form">
          <div class="form-group" v-for="(input, index) in formData" :key="index">
            <input :type="input.type" :id="input.id" :value="input.value" @input="input.value = $event.target.value" :placeholder="input.placeholder" />
          </div>
          <div v-if="showCheckbox" class="form-group checkbox-group">
            <input type="checkbox" id="checkbox" v-model="formData.acceptTerms" />
            <label for="checkbox">Aceitar termos e condições</label>
          </div>
          <button v-if="backgroundType === 'jogo'" @click="spin" :disabled="isSpinning || !isFormValid" class="spin-button">Girar</button>
          <button v-else :disabled="isSpinning || !isFormValid" class="spin-button">Enviar</button>
        </form>
        <div v-if="!isSpinning && backgroundType === 'jogo'" class="result" v-show="showResult">
          {{ finalResult }}
        </div>
      </div>
    </div>

    <div v-if="showResult && !isPopupVisible" class="result-overlay">
      <div class="result-content">
        <button class="close-button" @click="closeResult">X</button>
        <div class="result-text">
          {{ finalResult }}
        </div>
      </div>
    </div>

    <div v-if="showResult && !isPopupVisible" class="result-overlay" :style="{ backgroundImage: 'url(\'src/assets/imagens/gif.gif\')' }">
      <div class="result-content">
        <button class="close-button" @click="closeResult">X</button>
        <div class="result-text">
          {{ finalResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '@/data.json';

export default {
  name: 'CustomPopup',
  data() {
    return {
      reels: data.reels,
      symbols: data.symbols,
      isSpinning: data.isSpinning,
      spinning: data.spinning,
      finalResult: data.finalResult,
      formData: data.formData,
      isPopupVisible: false,
      backgroundType: data.backgroundType,
      backgroundImage: data.backgroundImage,
      videoUrl: data.backgroundVideo,
      showCheckbox: data.showCheckbox,
      showResult: false,
    };
  },
  computed: {
    isFormValid() {
      for (const input of this.formData) {
        if (!input.value) {
          return false;
        }
      }
      return true;
    },
    getPopupTitle() {
      if (this.backgroundType === 'video') {
        return data.popupData.titleVideo;
      }
      return data.popupData.title;
    },
    getPopupSubtitle() {
      if (this.backgroundType === 'video') {
        return data.popupData.subtitleVideo;
      }
      return data.popupData.subtitle;
    },
  },
  methods: {
    getSymbolImage(index) {
      return require('@/assets/imagens/' + this.symbols[index].name);
    },
    getVideoId(url) {
      const videoId = url.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        return videoId.substring(0, ampersandPosition);
      }
      return videoId;
    },
    submitForm() {
      if (this.finalResult) {
        alert(`Resultado: ${this.finalResult}`);
      }
      // Lógica de manipulação do formulário
    },
    closePopup() {
      this.isPopupVisible = false;
    },
    closeResult() {
      this.showResult = false;
      this.isPopupVisible = false;
    },
    spin() {
      if (this.isSpinning) return;

      this.isSpinning = true;
      this.spinning = true;

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * this.symbols.length);
        this.reels = [randomIndex, randomIndex, randomIndex];
        this.finalResult = null; 
        this.showResult = false;

        setTimeout(() => {
          this.isSpinning = false;
          this.spinning = false;

          setTimeout(() => {
            this.finalResult = this.symbols[randomIndex].value;
            this.showResult = true;
            this.closePopup(); // Fechar o pop-up após o término do giro
          }, 2000);
        }, 3000);
      }, 5000);
    },
    restartVideo() {
      const videoElement = document.getElementById('background-video');
      if (videoElement) {
        videoElement.currentTime = 10;
        videoElement.play();
      }
    },
  },
  mounted() {
    import('@/data.json').then((data) => {
      this.backgroundImage = require('@/assets/imagens/' + data.default.backgroundImage);
    }).catch((error) => {
      console.error('Erro ao importar o arquivo JSON:', error);
    });
    setTimeout(() => {
      this.isPopupVisible = true;
    }, 1000);

    this.popupData = {
      title: data.popupData.title,
      subtitle: data.popupData.subtitle,
    };
  },
};
</script>

<style scoped>
  .popup {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(240, 240, 250, 0.5);
    z-index: 1000;
  }

  .popup-content {
    position: relative;
    background-color: #CE0014;
    background-position: center;
    padding: 20px;
    border-radius: 5px;
    z-index: 1001;
    max-width: 800px;
    width: 100%;
    max-height: 700px;
    height: 90%;
    text-align: center;
    box-sizing: border-box;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.035) 0px 2.8px 2.2px,
      rgba(0, 0, 0, 0.047) 0px 6.7px 5.3px,
      rgba(0, 0, 0, 0.06) 0px 12.5px 10px,
      rgba(0, 0, 0, 0.07) 0px 22.3px 17.9px,
      rgba(0, 0, 0, 0.086) 0px 41.8px 33.4px,
      rgba(0, 0, 0, 0.12) 0px 100px 80px;
  }

  .popup-title {
    position: absolute;
    font-size: 24px;
    color: #ffffff;
    top: 0;
    margin-bottom: 0.5rem;
  }

  .popup-subtitle {
    position: absolute;
    top: 30px;
    font-size: 18px;
    color: #ffffff;
    margin-bottom: 1rem;
  }

  .background-popup {
    position: absolute;
    top: 8%;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    opacity: 1;
    z-index: -1;
    width: 60%;
    height: 50%;
    margin: 0 auto;
  }

  #background-video {
    top: 16%;
    height: 40%;
  }

  .slot-machine {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .reels {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 60%;
    right: 38%;
  }

  .reel {
    margin: 0 10px;
  }

  .symbol-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .symbol {
    width: 4rem;
    height: 4rem;
    transition: transform 2s ease;
    transform-origin: center center;
    z-index: 100;
  }

  .spinning {
    animation: spin 0.3s infinite;
  }

  @keyframes spin {
    0% {
      transform: translateY(0);
    }
    20% {
      opacity: 0.2;
    }
    50%, 80%, 90%, 98% {
      opacity: 0;
    }
    100% {
      transform: translateY(50%);
    }
  }

  .result {
    margin-top: 20px;
    z-index: 500;
  }

  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    z-index: 1002;
  }

  .form-group {
    margin-bottom: 5px;
    width: 100%;
  }

  .form-group label {
    font-size: 16px;
    color: #FFFFFF;
    margin-bottom: 5px;
  }

  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group textarea {
    width: 60%;
    padding: 0.3rem;
    border-radius: 5px;
    border: none;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #000000;
    box-sizing: border-box;
    outline: none;
  }

  .form-group textarea {
    height: 100px;
  }

  .form-group select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #000000;
    box-sizing: border-box;
    outline: none;
  }

  .form-group input[type="submit"] {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #CE0014;
    font-size: 14px;
    color: #FFFFFF;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
  }

  .form-group input[type="tel"] {
    width: 60%;
    padding: 0.3rem;
    border-radius: 5px;
    border: none;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #000000;
    box-sizing: border-box;
    outline: none;
  }

  .video-form{
    margin-top: 35%;
  }

  .spin-button {
    width: 30%;
    padding: 1%;
    border-radius: 15px;
    background-color: #180709;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: bold;
    border: none;
    outline: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .spin-button:hover {
    background-color: #6e0f17;
  }

  .spin-button:disabled {
    background-color: #6e0f17;
    cursor: not-allowed;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(255, 255, 0, 0);
    border: none;
    color: #FFFFFF;
    font-size: 25px;
    cursor: pointer;
    margin: 10px 10px 0 0;
    box-shadow: 1px 1px 1px 1px #000000a8;
  }
  .close-button:hover {
    box-shadow: none;
    border: 1px solid #000000;
  }

  .background-popup video {
    position: absolute;
    top: 8%;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    opacity: 1;
    z-index: -1;
    width: 60%;
    height: 50%;
    margin: 0 auto;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-group input[type="checkbox"]::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    background-color: #ffffff;
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .checkbox-group label {
    font-size: 14px;
    color: #ffffff;
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 5px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 3px;
    border: 2px solid #ffffff;
    outline: none;
    transition-duration: 0.3s;
    cursor: pointer;
    position: relative;
    margin-bottom: 8px;
  }

  .checkbox-group input[type="checkbox"]:checked {
    background-color: #ffffff;
    border-color: #ffffff;
  }

  .checkbox-group input[type="checkbox"]:checked::before {
    content: '✔';
    position: absolute;
    top: 0;
    left: 40%;
    transform: translate(-50%, -50%) scale(1.4);
    font-size: 0.7rem;
    color: #CE0014;
    background-color: #ffffff00;
    opacity: 1;
  }

  .result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(168, 157, 157, 0.295);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-content {
    position: relative;
    max-width: 600px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    text-align: center;
    background-image: url("../assets/imagens/gif.gif");
    background-repeat: no-repeat;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .result-text {
    font-size: 30px;
    margin-top: 50px;
    color: #000000;
    font-weight: 800;
  }

  @media only screen and (max-width: 1100px) {
    .popup-title {
      font-size: 16px;
    }

    .popup-subtitle {
      position: absolute;
      top: 20px;
      font-size: 12px;
    }

    /* .background-popup {
      position: absolute;
      top: -10%;
      width: 520px;
      height: 400px;
    } */

    .reels {
      position: absolute;
      bottom: 60%
    }

    .symbol {
      width: 4rem;
      height: 4rem;
    }
  }

  @media only screen and (max-width: 800px) {
    .popup-content {
      max-width: 90%;
    }

    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group textarea,
    .form-group select,
    .form-group input[type="tel"] {
      width: 100%;
    }
    .popup-title {
      font-size: 14px;
    }

    .popup-subtitle {
      position: absolute;
      top: 20px;
      font-size: 10px;
    }
    #background-video{
      top: 10%;
      height: 40%;
    }
    .reels {
      position: absolute;
      bottom: 60%;
      left: 30%;
    }
    .background-popup {
      position: absolute;
      top: 5%;
      width: 500px;
      height: 250px;
    }
    .symbol {
      width: 4rem;
      height: 4rem;
    }

  }

  @media only screen and (max-width: 680px) {
    .video-form {
      margin-top: 50%;
    }
    .reels {
      position: absolute;
      bottom: 65%
    }
    .background-popup {
      position: absolute;
      top: -5%;
      width: 420px;
      height: 320px;
    }
    .symbol {
      width: 3.5rem;
      height: 3.5rem;
    }
  }

  @media only screen and (max-width: 550px) {
    .video-form {
      margin-top: 60%;
    }
    .background-popup {
      position: absolute;
      top: 2%;
      width: 400px;
      height: 300px;
    }
    .symbol {
      width: 3rem;
      height: 3rem;
    }
    .spin-button {
      width: 30%;
      padding: 1.5%;
    }
  }

  @media only screen and (max-width: 460px) {
    .background-popup {
      position: absolute;
      top: 2%;
      width: 350px;
      height: 250px;
    }
    .symbol {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  @media only screen and (max-width: 400px) {
    .video-form {
      margin-top: 80%;
    }
    .background-popup {
      position: absolute;
      top: 5%;
      width: 320px;
      height: 250px;
    }
    .symbol {
      width: 2rem;
      height: 2rem;
    }
    .spin-button {
      width: 30%;
      padding: 2%;
    }
  }

  @media only screen and (max-width: 380px) {
    .background-popup {
      position: absolute;
      top: 5%;
      width: 280px;
      height: 220px;
    }
    .symbol {
      width: 2rem;
      height: 2rem;
    }
  }

</style>
