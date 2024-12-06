import { CSSProperties } from "react"
import { Album } from "../albums"

interface AlbumListProps {
	albums: Album[],
	selectedIdx: number,
	onAlbumClick?: (idx: number) => void
}

export default function AlbumList({
	albums,
	selectedIdx,
	onAlbumClick,
}: AlbumListProps) {
	const styles: {
		base: CSSProperties,
		item: CSSProperties,
		selectedItem: CSSProperties,
		oddItem: CSSProperties,
		evenItem: CSSProperties,
		img: CSSProperties,
	} = {
		base: {
			display: 'flex',
			flexDirection: 'column',
			padding: 0,
			margin: 0,
			maxHeight: '100%',
			overflowY: 'auto'
		},
		item: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.75rem',
			listStyle: 'none',
			maxHeight: '4rem',
			padding: '0.5rem .75rem',
			color: '#bebebe',
			cursor: 'pointer'
		},
		selectedItem: {
			backgroundColor: '#3e1749',
			pointerEvents: 'none'
		},
		oddItem: {
			backgroundColor: '#2b2b2b',
		},
		evenItem: {
			backgroundColor: '#414141',
		},
		img: {
			maxHeight: 'inherit'
		}
	}

	const getItemStyle = (idx: number): CSSProperties => {
		if (idx === selectedIdx) {
			return {...styles.item, ...styles.selectedItem};
		} else if (idx % 2 === 0) {
			return {...styles.item, ...styles.oddItem};
		} else {
			return {...styles.item, ...styles.evenItem};
		}
	}

	return (
		<ul style={styles.base}>
			{ albums.map((album, idx) =>
				<li
					key={idx}
					style={getItemStyle(idx)}
					onClick={() => {
						if (onAlbumClick) onAlbumClick(idx);
					}}
				>
					<img
						style={styles.img}
						src={`./audio/${album.folder}/${album.coverUrl}`}
						alt={`${album.title} cover`}
						title={`${album.title}`}
					/>
					{album.title}
				</li>
			)}
		</ul>
	)
}