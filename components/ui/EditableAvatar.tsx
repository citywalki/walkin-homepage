import { createSignal } from "solid-js";

interface EditableAvatarProps {
	src: string;
	onChange: (src: string) => void;
	alt?: string;
}

export function EditableAvatar(props: EditableAvatarProps) {
	const [isHovered, setIsHovered] = createSignal(false);

	const handleChange = () => {
		const url = window.prompt("输入头像图片地址", props.src);
		if (url !== null) {
			props.onChange(url.trim());
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleChange();
		}
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: image wrapper with hover feedback
		<div
			role="button"
			tabIndex={0}
			aria-label="更换头像"
			class="editable-avatar"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			on:click={(e) => {
				e.stopPropagation();
				handleChange();
			}}
			on:keydown={handleKeyDown}
		>
			<img
				src={props.src}
				alt={props.alt ?? ""}
				classList={{
					hovered: isHovered(),
				}}
			/>
		</div>
	);
}
