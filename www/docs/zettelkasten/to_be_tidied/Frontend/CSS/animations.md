---
sidebar_position: 3
sidebar_label: Animations
---

# Animations

```
.animate {
    animation-duration: 1s;
    animation-fill-mode: both;
}

.animate.animate--infinite {
    animation-iteration-count: infinite;
}

.animate.animate--delay-1s {
    animation-delay: 1s;
}

.animate.animate--fast {
    animation-duration: 0.6s;
}

.animate.animate--slow {
    animation-duration: 3s;
}

@keyframes slideInLeft {
    from {
        transform: translateX(-300px);
    }
    to {
        transform: translateX(0);
    }
}

.slide-in-left {
    animation: slideInLeft;
    animation-timing-function: ease-in
}

@keyframes slideInRight {
    from {
        transform: translateX(300px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes rotate {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-30px);
    }
    60% {
        transform: translateY(-15px);
    }
}

.bounce {
    animation-name: bounce;
}
```
