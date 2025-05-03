import {useState} from "react";

type DropdownType = "user" | "menu" | null;

export function useDropdownManager() {
    const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

    const toggleDropdown = (type: DropdownType) => {
        setOpenDropdown((prev) => (prev === type ? null : type));
    };

    const isOpen = (type: DropdownType) => openDropdown === type;

    const closeDropdown = () => setOpenDropdown(null);

    return { isOpen, toggleDropdown, closeDropdown };
}
