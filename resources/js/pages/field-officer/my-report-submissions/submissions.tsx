import { ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Submissions() {
    const { mySubmissions } = usePage<{ mySubmissions: ReportSubmission[] }>()
        .props;

    console.log({ mySubmissions });
    return (
        <div>
            {mySubmissions.map((submission) => (
                <div>
                    <p>
                        Submitted on:{' '}
                        {new Date(submission.created_at).toLocaleDateString(
                            'en-US',
                            {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            },
                        )}
                    </p>
                    <h1>{submission.id}</h1>

                    <div>{submission.status}</div>
                </div>
            ))}
        </div>
    );
}
