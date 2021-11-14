<template>
  <div class="avatar-crop-modal">
    <transition name="fade">
      <div class="avatar-crop-wrapper" v-if="show">
        <div class="overlay" @click.self="show = false">
          <div class="modal">
            <div class="avatar-editer">
              <cropper
                class="cropper center"
                :src="img"
                ref="avatar_edit"
                @change="onChange"
                :debounce="false"
                background-class="crop-bg"
                foreground-class="foreground-bg"
                stencil-component="circle-stencil"
                :default-size="defaultSize"
              />
            </div>
            <div class="preview-status-wrapper center">
              <div class="preview-status-container">
                <div class="status">
                  <preview
                    class="status-preview small"
                    :image="result.image"
                    :coordinates="result.coordinates"
                    id="preview-online"
                    style="width: 40px; height: 40px"
                  />
                  <div class="status-circle circle-online" />
                </div>
                <div class="status">
                  <preview
                    class="status-preview small"
                    :image="result.image"
                    :coordinates="result.coordinates"
                    id="preview-dnd"
                    style="width: 40px; height: 40px"
                  />
                  <div class="status-circle circle-red" />
                </div>
                <div class="status">
                  <preview
                    class="status-preview"
                    :image="result.image"
                    :coordinates="result.coordinates"
                    id="preview-main"
                    style="width: 80px; height: 80px"
                  />
                </div>
                <div class="status">
                  <preview
                    class="status-preview small"
                    :image="result.image"
                    :coordinates="result.coordinates"
                    id="preview-idle"
                    style="width: 40px; height: 40px"
                  />
                  <div class="status-circle circle-idle" />
                </div>
                <div class="status">
                  <preview
                    class="status-preview small"
                    :image="result.image"
                    :coordinates="result.coordinates"
                    id="preview-offline"
                    style="width: 40px; height: 40px"
                  />
                  <div class="status-circle circle-away" />
                </div>
              </div>
            </div>
            <div class="tools-wrapper center">
              <div class="tools-container">
                <div class="section">
                  <span class="topic">
                    <b>Rotation</b>
                  </span>
                  <div class="interactables center">
                    <button class="main-btn left" @click="rotate(-90)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"
                        />
                      </svg>
                    </button>
                    <button class="main-btn right" @click="rotate(90)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="section">
                  <span class="topic">
                    <b>Zoom</b>
                  </span>
                  <div class="interactables center">
                    <button class="main-btn left" @click="zoom(1.3)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"
                        />
                      </svg>
                    </button>
                    <button class="main-btn right" @click="zoom(0.91)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="section">
                  <span class="topic">
                    <b>Flip</b>
                  </span>
                  <div class="interactables center">
                    <button class="main-btn left" @click="flip(false, true)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"
                        />
                      </svg>
                    </button>
                    <button
                      class="main-btn sideways right"
                      @click="flip(true, false)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="section">
                  <span class="topic">
                    <b>Position</b>
                  </span>
                  <div class="interactables-adjust center">
                    <button
                      class="main-btn left"
                      @click="transform('maximize')"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"
                        />
                      </svg>
                    </button>
                    <button
                      class="main-btn middle"
                      @click="transform('center')"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                        />
                      </svg>
                    </button>
                    <button class="main-btn right" @click="transform('reset')">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <g><path d="M0,0h24v24H0V0z" fill="none" /></g>
                        <g>
                          <g>
                            <path
                              d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z M20,13c0-4.42-3.58-8-8-8c-0.06,0-0.12,0.01-0.18,0.01l1.09-1.09L11.5,2.5L8,6l3.5,3.5l1.41-1.41 l-1.08-1.08C11.89,7.01,11.95,7,12,7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02C16.95,20.44,20,17.08,20,13z"
                            />
                          </g>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="tool-action-buttons">
              <button class="main-btn save-btn" id="save-btn" @click="saveIcon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"
                  />
                </svg>
              </button>
              <button class="cancel-btn" id="cancel-btn" @click="cancel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  />
                </svg>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { Cropper, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
let ctx;
let userModule;
export default {
  components: {
    Cropper,
    Preview,
  },
  props: {
    user: Object,
    show: Boolean,
    img: String,
  },
  computed: {
    
    showFalse() {
      return this.show = false;
    }
  },
  async mounted() {
    ctx = this;
    await this.requireModules("rest");
    let rest = this.Chatty.Rest;
    userModule = rest.getModule("user");
  },
  data() {
    return {
      result: {
        coordinates: null,
        image: null,
      },
       showValue: this.show,
      flip(x, y) {
        if (this.$refs.avatar_edit.rotate % 180 !== 0) {
          this.$refs.avatar_edit.flip(!x, !y);
        } else {
          this.$refs.avatar_edit.flip(x, y);
        }
      },
      rotate(angle) {
        this.$refs.avatar_edit.rotate(angle);
      },
      zoom(factor) {
        this.$refs.avatar_edit.zoom(factor);
      },
      transform(mode) {
        if (mode === "center") {
          this.$refs.avatar_edit.setCoordinates(
            ({ imageSize, coordinates }) => ({
              left: imageSize.width / 2 - coordinates.width / 2,
              top: imageSize.height / 2 - coordinates.height / 2,
            })
          );
        }

        if (mode === "maximize") {
          const center = {
            left:
              this.$refs.avatar_edit.coordinates.left +
              this.$refs.avatar_edit.coordinates.width / 2,
            top:
              this.$refs.avatar_edit.coordinates.top +
              this.$refs.avatar_edit.coordinates.height / 2,
          };

          this.$refs.avatar_edit.setCoordinates([
            ({ imageSize }) => ({
              width: imageSize.width,
              height: imageSize.height,
            }),
            ({ coordinates }) => ({
              left: center.left - coordinates.width / 2,
              top: center.top - coordinates.height / 2,
            }),
          ]);
        }

        if (mode === "reset") {
          this.$refs.avatar_edit.reset();
        }
      },
    };
  },
  methods: {
    onChange({ coordinates, image }) {
      ctx.image = image;
      ctx.result = {
        coordinates,
        image,
      };
    },
    defaultSize({ imageSize, visibleArea }) {
      return {
        width: (visibleArea || imageSize).width,
        height: (visibleArea || imageSize).height,
      };
    },
    async saveIcon(event) {
      const { canvas } = this.$refs.avatar_edit.getResult();
      const data = canvas.toDataURL();
      await ctx.$swal({
        icon: "warning",
        title: "New Avatar",
        html: "<b>Are you sure?</b>",
        imageUrl: data,
        imageHeight: 128,
        imageWidth: 128,
        showCancelButton: true,
        confirmButtonColor: "#44e481",
        cancelButtonColor: "#e45744",
        confirmButtonText: `<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#2a2a2a"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"/></svg>`,
        cancelButtonText:
          '<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#2a2a2a"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>',
      });
      let encoded = data.replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      await userModule.update(
        localStorage.getItem("account"),
        "avatar",
        encoded
      );
      location.reload();
    },
    cancel(event) {
     this.$emit('update:show', false);
    }
  },
};
</script>
<style scoped>
.cropper {
  background: transparent;
}
.preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.vue-circle-stencil {
  border-color: rgba(251, 207, 232, var(--tw-border-opacity));
}
.tools-container {
  display: flex;
  min-width: 530px;
  min-height: 178px;
  width: 30%;
  height: 18vh;
  background: #1f1f1f;
  --tw-shadow-color: 0, 0, 0;
  --tw-shadow: 0 4px 16px 0 rgba(var(--tw-shadow-color), 0.6);
  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border: #3b3b3b 2px solid;
}
.preview-status-wrapper {
  margin-top: 20px;
  margin-bottom: 20px;
}
.preview-status-container {
  flex-direction: row;
  display: flex;
}
.status-preview {
  margin-right: 20px;
  border-radius: 50%;
  vertical-align: middle;
}
.small {
  margin-top: 20px;
}

.status-circle {
  box-shadow: 0 0 0 2px rgba(43, 43, 43, 0.705);
  height: 0.625rem;
  width: 0.625rem;
  border-radius: 50%;
  margin-left: 29px;
  margin-top: -11px;
  position: relative;
}
.circle-red {
  background-color: rgba(248, 113, 113);
}
.circle-idle {
  background-color: #faa81a;
}
.circle-online {
  background-color: #4ade80;
}
.circle-away {
  background-color: #a1a1aa;
}
.tools-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.section {
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 50px;
}
.topic {
  margin-bottom: 25px;
  font-family: Inter;
  color: var(--nqw);
  opacity: 0.4;
  font-weight: normal;
}
.interactables {
  display: flex;
  margin-top: 25%;
  flex-direction: row;
}
.interactables-adjust {
  display: flex;
  margin-top: 16%;
  flex-direction: row;
}
.left {
  margin-right: 5%;
}
.right {
  margin-left: 5%;
}
.avatar-editer {
  margin-top: 20px;
  padding: 10px;
}
.save-btn {
  margin-left: 10px;
}
.sideways {
  transform: rotate(90deg);
}
@media screen and (max-width: 532px) {
  .tools-container {
    margin-top: 25%;
    flex-direction: column;
    background: transparent;
    box-shadow: none;
    border: none;
  }
  .left {
    margin-right: 2%;
  }
  .right {
    margin-left: 2%;
  }
  .interactables {
    margin-top: 0%;
  }
  .interactables-adjust {
    margin-top: 0%;
  }
  .tool-action-buttons {
    position: absolute;
    right: 10px;
    bottom: 0px;
  }
  .modal {
    min-height: 100%;
    min-width: 100%;
    width: 100%;
    height: 100%;
    padding: 0px;
  }
  .topic {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 0px;
  }
}
.modal {
  width: 75vw;
  margin: auto;
  padding: 20px;
  background-color: #2a2a2a;
  box-shadow: 0 2px 8px 3px;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 15px;
  animation: slideDown 500ms ease forwards;
  height: 95%;
  overflow: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}
.tool-action-buttons {
  display: flex;
  margin-top: -45px;
  flex-direction: row-reverse;
}
</style>