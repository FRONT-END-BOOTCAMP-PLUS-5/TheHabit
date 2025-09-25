import React from 'react';

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type SvgIconProps = {
  icon: SvgComponent;
  className?: string;
  title?: string;
} & React.SVGProps<SVGSVGElement>;

export default function SvgIcon({ icon: Icon, className, title, ...rest }: SvgIconProps) {
  return <Icon aria-label={title} className={className} {...rest} />;
}
