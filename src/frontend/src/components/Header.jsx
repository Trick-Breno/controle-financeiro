import { UserButton } from "@clerk/clerk-react";

const Header = () => {
    return (
        <div className="pt-4 flex justify-end px-6">
            <UserButton />
        </div>
    );
};

export default Header;