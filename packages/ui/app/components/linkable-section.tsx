import LinkIcon from '@mui/icons-material/Link';
import Typography from '@mui/material/Typography';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

interface Props extends PropsWithChildren {
  readonly title: string;
}

export const LinkableSection: FunctionComponent<Props> = ({ children, title }) => {
  const navigate = useNavigate();
  const [isHoveredOver, setHover] = useState(false);

  const id = title.toLowerCase().split(' ').join('_');

  const linkToAnchor = (anchorElement: Element): void => {
    navigate(`#${id}`);
    anchorElement.scrollIntoView();
  };

  return (
    <Box sx={{ margin: '25px 0' }}>
      <Typography
        id={id}
        onClick={(event) => linkToAnchor(event.currentTarget)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ color: 'text.secondary', cursor: 'pointer', display: 'flex', marginBottom: '5px' }}
        variant='h5'>
        {title}
        {isHoveredOver && <LinkIcon sx={{ margin: 'auto 5px' }} />}
      </Typography>

      {children}
    </Box>
  );
};
