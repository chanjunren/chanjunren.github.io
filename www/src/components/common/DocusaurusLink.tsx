type DocusarusLinkProps = {
  to: string;
  subLabel: string;
  label: string;
  className?: string;
};

const DocusaurusLink: React.FC<DocusarusLinkProps> = ({
  to,
  subLabel,
  label,
  className,
}) => {
  return (
    <div className={`pagination-nav__item ${className}`}>
      <a className="pagination-nav__link" href={to} target="_blank">
        <div className="pagination-nav__sublabel">{subLabel}</div>
        <div className="pagination-nav__label">{label}</div>
      </a>
    </div>
  );
};

export default DocusaurusLink;
