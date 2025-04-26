import {ReactNode} from "react";
import classes from "./modal.module.css"

interface CopyModalProps {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    children?: ReactNode;
    useModalBackdrop?: boolean;
    showBlocker?: boolean;
}

export default function Modal({
                                  showModal,
                                  setShowModal,
                                  children,
                              }: CopyModalProps) {


    return (
        <>
            {showModal && (
                <div className={classes.backdrop} onClick={() => setShowModal(false)}>
                    <div className={classes.container}>
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}