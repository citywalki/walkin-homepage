import type { JSX } from "solid-js";
import { Show, splitProps } from "solid-js";
import { Spinner } from "./spinner";

interface ButtonLoadingProps {
	loading?: boolean;
	loadingText?: JSX.Element;
}

export interface ButtonProps
	extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
		ButtonLoadingProps {
	children?: JSX.Element;
}

export const Button = (props: ButtonProps) => {
	const [localProps, rest] = splitProps(props, [
		"loading",
		"disabled",
		"loadingText",
		"children",
	]);
	const trulyDisabled = () => localProps.loading || localProps.disabled;

	return (
		<button
			disabled={trulyDisabled()}
			class="btn"
			{...rest}
		>
			<Show
				when={localProps.loading && !localProps.loadingText}
				fallback={localProps.loadingText || localProps.children}
			>
				<Spinner
					width="1.1em"
					height="1.1em"
					borderWidth="1.5px"
					borderTopColor="rgba(255,255,255,0.5)"
					borderRightColor="rgba(255,255,255,0.5)"
				/>
				<span style={{ visibility: "hidden" }}>{localProps.children}</span>
			</Show>
		</button>
	);
};
