import React from 'react';
import styles from './spinner.module.css';

const Spinner = () => {
  return (
    <div class={styles.ldsEllipsis}><div></div><div></div><div></div><div></div></div>
  )
}

export default Spinner;