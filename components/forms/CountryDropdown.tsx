import { COUNTRIES } from '@/lib/Countries';
import CountryLabel from './CountryLabel';
import DropdownField from './DropdownField';

export default function CountryDropdown({
    selected,
    onSelect,
    emoji,
    disabled = false,
}: {
    selected: string | null;
    onSelect: (value: string | null) => void;
    emoji?: string;
    disabled?: boolean;
}) {
    return (
        <div className='flex flex-row justify-between'>
            {emoji && <span className='mr-4 text-4xl'>{emoji}</span>}
            <DropdownField
                options={Object.keys(COUNTRIES).map((code) => ({
                    value: code,
                    label: <CountryLabel code={code} />,
                }))}
                selected={selected}
                onSelect={onSelect}
                disabled={disabled}
            />
        </div>
    );
}
