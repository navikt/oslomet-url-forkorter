import {Backdrop, ModalContainer} from "./modal.style.ts";
import {ReactNode} from "react";

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
                <Backdrop onClick={() => setShowModal(false)}>
                    <ModalContainer>
                        {children}
                    </ModalContainer>
                </Backdrop>
            )}
        </>
    )
}