import styles from './updateModal.module.css';
import Image from 'next/image';
import SplitForm from '../splitForm/splitForm';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

const UpdateModal = ({ isDepositClicked, handleOverlayClicked, closeModal, swAddress }) => {

    const { splitFormState } = useContainer(Global);
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
                            <h3 className={styles.updateLabel}>Update your sub-wallets allocations</h3>
                            <SplitForm splitState={splitFormState.splitState} style={{width: '100%'}}/>
                        </div>
                    </div>
            } 
        </>
    )
}

export default UpdateModal;


