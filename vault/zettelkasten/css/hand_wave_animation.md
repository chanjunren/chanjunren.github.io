20240319 2345

Tags: #css #animation

# hand_wave_animation
```css
@keyframes hand-wave-animation {
  0%, 50%, 100% {
    transform: rotate(0deg);
  }
  25%, 75% {
    transform: rotate(60deg);
  }
}

.hand-wave {
  animation-name: hand-wave-animation;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  cursor: default;
}


.hand-wave:hover {
  animation-name: hand-wave-animation;
  animation-duration: 0.9999s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: unset;
}
```



--- 
# References
- ChatGPT
