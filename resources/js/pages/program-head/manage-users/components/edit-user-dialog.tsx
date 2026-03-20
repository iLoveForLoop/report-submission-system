// import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/types';
import EditProfileForm from './edit-form';

type pageProps = {
    openDialog: boolean;
    closeDialog: () => void;
    user: User;
};

export default function EditUserDialog({
    user,
    openDialog,
    closeDialog,
}: pageProps) {
    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent className="z-50 flex h-[90vh] w-[95vw] !max-w-none flex-col sm:w-[85vw] lg:w-[70vw]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile below.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-6rem)] flex-1 pr-0 lg:pr-4">
                    <EditProfileForm user={user} closeDialog={closeDialog} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
