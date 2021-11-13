<template>
  <div class="base-button-container">
    <div class="base-button-sub-container">
      <button v-if="!icon && !disabled" :class="`baseButton ${type} bb`" @click="ex" :style="`height: ${height}; width: ${width}; background-color: ${(active) ? `${type};` : '#36393F; opacity: 0.8;'}`" ><div class="baseButtonContents">
        <div class="baseButtonContent">
        <div class="baseButtonLabel" :style="`line-height: ${ (height && height.includes('px')) ? parseInt(height.replace('px'))-2 + '' : 'auto'};`">{{text}}</div>
        </div></div></button>

        <button v-if="!icon && disabled" :class="`baseButton ua`" :style="`height: ${height}; width: ${width}; background-color: var(--${type}-clicked); cursor: not-allowed;`" v-tooltip="'Coming Soon...'">
          <div class="baseButtonContents">
        <div class="baseButtonContent">
        <div class="baseButtonLabel" :style="`line-height: ${ (height && height.includes('px')) ? parseInt(height.replace('px'))-2 + '' : 'auto'};`">{{text}}</div>
        </div></div></button>

      <button v-if="icon && !disabled" :class="`baseButton ${type} bb`" @click="ex" :style="`height: ${height}; width: ${width}; background-color: ${(active) ? `${type}` : '#36393F; opacity: 0.8;'}`">

        <div class="baseButtonContents">
        <div class="baseButtonContent">
        <img :src="icon" :height="(height && height.includes('px')) ? parseInt(height.replace('px'))-10 + '' : 'auto'" :width="(height && height.includes('px')) ? parseInt(height.replace('px'))-10 + '' : 'auto'" class="baseButtonIcon" :alt="`${type} icon ${icon.replace('~/assets/svg/placeholders')}`"/>
        <div class="baseButtonLabel sb" :style="`line-height: ${ (height && height.includes('px')) ? parseInt(height.replace('px'))-2 + 'px' : 'auto'};`">{{text}}</div>
        </div>
        </div>
      </button>

       <button v-if="icon && disabled" :class="`baseButton ua`" :style="`height: ${height}; width: ${width}; background-color: var(--${type}-clicked); cursor: not-allowed;`" v-tooltip="'Coming Soon...'" :alt="`${type} icon ${icon.replace('~/assets/svg/placeholders')}`">

        <div class="baseButtonContents">
        <div class="baseButtonContent">
        <img :src="icon" :height="(height && height.includes('px')) ? parseInt(height.replace('px'))-10 + '' : 'auto'" :width="(height && height.includes('px')) ? parseInt(height.replace('px'))-10 + '' : 'auto'" class="baseButtonIcon" :alt="`${type} icon ${icon.replace('~/assets/svg/placeholders')}`"/>
        <div class="baseButtonLabel sb" :style="`line-height: ${ (height && height.includes('px')) ? parseInt(height.replace('px'))-2 + 'px' : 'auto'};`">{{text}}</div>
        </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    text: String,
    type: {
      type: String,
      required: false,
      default: "default"
    },
    icon: {
      type: String,
      required: false
    },
    height: {
        type: String,
        required: false
    },
     width: {
        type: String,
        required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    active: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    ex: function (props) {
      console.log(props);
      this.$emit('clicked', props);
    }
  }
};
</script>

<style scoped>
.baseButton {
    border-radius: 3px;
    background: transparent;
    border: none;
    color: var(--dark);
    font-family: var(--oxy);
    cursor: pointer;
    transition: background 250ms ease;
    display: inline-block;
    height: fit-content;
  width: fit-content;
  display: flex;
  min-width: 32px;
  min-height: 16px;
  font-family: Whitney,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 1em;
  color: var(--nqw);
  transition: all 300ms ease 0s;
}
.bb:hover {
    opacity: 0.8 ;
}
.default {
    background: var(--primary);
}
.default:focus {
    background: var(--primary-clicked) !important;
}
/*
.default:hover {
  box-shadow: 0px 15px 20px var(--primary-clicked);
   transform: translateY(-7px);
}
*/
.danger {
    background: var(--danger);
}
.danger:focus {
    background: var(--danger-clicked) !important;
}
/* .danger:hover {
  box-shadow: 0px 15px 20px var(--danger-clicked);
   transform: translateY(-7px);
} */
.warning {
    background: var(--warning);
}
.warning:focus {
    background: var(--warning-clicked) !important;
}
/* .warning:hover {
  box-shadow: 0px 15px 20px var(--warning-clicked);
   transform: translateY(-7px);
} */
.confirm {
    background: var(--confirm);
}
.confirm:focus {
    background: var(--confirm-clicked) !important;
}
/* .confirm:hover {
  box-shadow: 0px 15px 20px var(--confirm-clicked);
   transform: translateY(-7px);
} */
.primary {
    background: var(--primary);
}
.primary:focus {
background: var(--primary-clicked) !important;
}
.baseButtonContent {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin: auto;
    min-width: 32px;
}
.baseButtonContents {
    margin: 0 auto;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.baseButtonLabel {
    overflow: hidden;
    text-overflow: ellipsis;
    -ms-flex-negative: 1;
    flex-shrink: 1;
    padding-left: 5px;
    padding-right: 5px;
}
.base-button-container {
  margin: 10px;
}
</style>