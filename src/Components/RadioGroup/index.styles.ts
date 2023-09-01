import { css } from '@emotion/css'

export const radioGroupComponent = css`
  display: flex;
  flex-direction: row;
  margin-top: 12px;

  label {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 0 !important;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    color: #3F4247;

    &:not(:first-child)  {
      margin-left: 20px;
    }
  }

  input[type="radio"] {
    margin: 0;
    width: 20px;
    height: 20px;
    visibility: hidden;
  }

  input[type="radio"] + span {
    margin-left: 8px !important;
    box-shadow: none !important;

    &:before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border: 1px solid #DCDFE6;
      border-radius: 50%;
      background-color: #fff !important;
      box-sizing: border-box;
      box-shadow: none;
    }
  }

  input[type="radio"]:checked + span {
    margin-left: 8px !important;

    &:before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border: 6px solid #2977EC;
      border-radius: 50%;
      background-color: #fff !important;
      box-sizing: border-box;
    }
  }

  input[type="radio"]:checked:disabled + span {
    background: transparent;
  }
`