import styles from './depositModal.module.css';
import Image from 'next/image';

const DepositModal = ({ isDepositClicked, handleOverlayClicked, closeModal, swAddress }) => {
  return (
      <>
           {isDepositClicked && 
                <div className={styles.overlay} onClick={handleOverlayClicked}>
                    <div className={styles.modal}>
                        <div className={styles.closeModal} onClick={closeModal}>
                            <Image 
                                src="/close-circle.svg"
                                width={40}
                                height={40}
                                alt="Split wallet"
                                className={styles.closeModalImage}
                            />
                        </div>
                        <p className={styles.sendEthLabel}>Send Eth to this Address</p>
                        <div className={styles.addressAndIcon}>
                            <p>{swAddress}</p>
                            <Image 
                                src="/deposit.svg"
                                width={20}
                                height={20}
                                alt="Split wallet"
                            />
                        </div>
                    </div>
                </div>
        } 
  
      </>
  )
}

export default DepositModal;