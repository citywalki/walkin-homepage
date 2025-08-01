import { Combobox, useListCollection } from "@ark-ui/solid/combobox";
import { Portal } from "solid-js/web";
import { css } from "../../styled-system/css";

function App() {
	let searchInput: HTMLInputElement;
	const searchFocus = () => {
		// @ts-ignore
		searchInput?.focus();
	};
	const searchKeydown = async (e) => {
		const search = e.target.value;
		if (!search || search === "") {
			return;
		}
		if (search.startsWith("/")) {
		}
		if (e.keyCode === 13) {
			location.href = `https://www.bing.com/search?q=${search}`;
		}
	};
	return (
		<div
			on:click={searchFocus}
			class={css({
				height: "screen",
				width: "full",
				bgColor: "#f9f9fb",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
			})}
		>
			<main
				class={css({
					display: "flex",
					flexDirection: "column",
					width: "720px",
					pt: "10rem",
					gap: 12,
				})}
			>
				<div
					class={css({
						display: "flex",
						height: "64px",
						spaceX: 3,
					})}
				>
					<img
						class={css({
							rounded: "xl",
							height: "64px",
							width: "64px",
							boxShadow: "2xl",
						})}
						src="https://cdn.v2ex.com/gravatar/97227251c4a0e846063fd5f1d5201c92?size=64"
						alt=""
					/>
					<div
						class={css({
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						})}
					>
						<p
							class={css({
								fontSize: "3xl",
							})}
						>
							Walkin
						</p>
						<p
							class={css({
								fontSize: "sm",
							})}
						>
							yolo.
						</p>
					</div>
				</div>
				<div class=" flex items-center bg-white rounded-lg border border-gray-200 shadow-md transition-shadow duration-200">
					<Combobox.Root>
						<Combobox.Control>
							<input
								on:keydown={searchKeydown}
								ref={searchInput}
								class={css({
									flexGrow: 1,
									py: 3,
									px: 2,
									outline: "none",
									fontSize: "xl",
									fontWeight: "500",
								})}
								type="text"
								placeholder="使用Bing搜索"
								id="searchInput"
							/>
						</Combobox.Control>
						<Portal>
							<Combobox.Positioner>
								<Combobox.Content></Combobox.Content>
							</Combobox.Positioner>
						</Portal>
					</Combobox.Root>
				</div>
			</main>
		</div>
	);
}

export default App;
