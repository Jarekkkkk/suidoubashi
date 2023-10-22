import { css, keyframes } from "@emotion/css";

export const skeleton = css`
    background-color: rgb(199, 199, 199);
    border-radius: 0.25rem;
`

export const skeleton_title = css`
    height: 1.25rem;
    margin - bottom: 1rem;
`

export const skeleton_text = css`
    height: 0.75rem;
`

export const skeleton_width = css`
    width: 100%;
`
export const skeleton_width_50 = css`
    width: 50px;
`

const pulse = keyframes`
    50% {
        opacity: .5;
    }
`
export const animate_pulse = css`
    animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`
