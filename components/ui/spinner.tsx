import { mergeProps, splitProps } from "solid-js";

export interface SpinnerProps {
	width?: string;
	height?: string;
	borderWidth?: string;
	borderTopColor?: string;
	borderRightColor?: string;
	borderBottomColor?: string;
	borderLeftColor?: string;
	label?: string;
}

export const Spinner = (props: SpinnerProps) => {
	const [_localProps, rootProps] = splitProps(props, ["label"]);
	const localProps = mergeProps({ label: "Loading..." }, _localProps);

	const style = () => ({
		width: rootProps.width ?? "1em",
		height: rootProps.height ?? "1em",
		"border-width": rootProps.borderWidth ?? "2px",
		"border-top-color": rootProps.borderTopColor ?? "currentColor",
		"border-right-color": rootProps.borderRightColor ?? "currentColor",
		"border-bottom-color": rootProps.borderBottomColor ?? "transparent",
		"border-left-color": rootProps.borderLeftColor ?? "transparent",
	});

	return (
		<div
			role="status"
			aria-label={localProps.label}
			class="spinner"
			style={style()}
		>
			<span class="sr-only">{localProps.label}</span>
		</div>
	);
};
