import { useMessyPropsContext } from '../modules';
import type { TMessyMessageProps } from '../types';

export function MessyMessageContentOther(props: TMessyMessageProps) {
  const { value } = props;
  const messyProps = useMessyPropsContext();

  if (
    value?.text ||
    value?.audio ||
    value?.image ||
    value?.video ||
    value?.location
  ) {
    return null;
  }

  if (typeof messyProps.renderMessageOther === 'function') {
    return messyProps.renderMessageOther({ ...props, ...messyProps });
  }

  return null;
}
