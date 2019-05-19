import {css, cx} from 'emotion'
import {ButtonOptions, ButtonHTMLProps} from 'reakit'

export function useButtonProps(
  { unstable_system }: ButtonOptions,
  htmlProps: ButtonHTMLProps = {}
): ButtonHTMLProps {

  const button = css`
    cursor: pointer;
  `;

  return { ...htmlProps, className: cx(button, htmlProps.className) };
}
