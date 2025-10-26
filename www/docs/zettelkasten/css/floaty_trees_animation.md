️🗓️ 19032024 1857
📎 #css #animation

# floaty_trees_animation

```typescript
import { FC } from "react";
import classNames from "classnames";
import styles from "./index.module.less";

interface JrLoadingPlaceholderProps {
  className?: string;
}

const JrLoadingPlaceholder: FC<JrLoadingPlaceholderProps> = ({ className }) => {
  return (
    <div className={classNames(styles.container, className)}>
      <span>🌳</span>
      <span>🌲</span>
      <span>🌴</span>
      <span>🌵</span>
    </div>
  );
};

export default JrLoadingPlaceholder;
```

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.container {
  display: flex;
  gap: 1rem;
}

.container span {
  display: inline-block;
  font-size: 1rem !important;
  animation-name: float;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.container span:nth-child(1) {
  animation-delay: 0s;
}

.container span:nth-child(2) {
  animation-delay: 0.2s;
}

.container span:nth-child(3) {
  animation-delay: 0.4s;
}

.container span:nth-child(4) {
  animation-delay: 0.6s;
}
```

---

## References

- ChatGPT and I
