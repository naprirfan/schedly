import { useState } from "react";
import { FormFieldsType } from "./form-fields";

interface DataFormProps<T> {
    initialData?: T;
    fields: FormFieldsType[];
    onSave: (data: T) => Promise<void>;
    title: string;
}

export function DataForm<T>({ initialData, fields, onSave, title }: DataFormProps<T>) {
    const [formData, setFormData] = useState<T>(initialData || {} as T);

    return (
        <form className="space-y-4 bg-white p-6 rounded-sm shadow-sm border" 
              onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {fields.map(field => (
                <div key={field.name as string}>
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                        type={field.type}
                        className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={(formData as any)[field.name] || ''}
                        onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                    />
                </div>
            ))}
            <button type="submit" className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save {title.split(' ')[1]}
            </button>
        </form>
    );
}