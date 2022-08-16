import { Box, Button, Paper, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { MdDone, MdClear } from 'react-icons/md';

const Admin = ({ routes }: { routes: { id: number; name: string }[] }) => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        pb: '2%',
      }}
    >
      <Paper sx={{ p: '2%', width: '60%' }} elevation={15}>
        <Typography sx={{ fontWeight: 'bold' }}>
          Tours waiting for approval
        </Typography>
        {routes.map((r, id) => (
          <Box
            key={id}
            onClick={() => router.push(`/route/view/${r.id}`)}
            sx={{
              mt: '2%',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid black',
              borderRadius: '5px',
              padding: '1%',
              cursor: 'pointer',
            }}
          >
            <Typography sx={{ float: 'left', flexGrow: '1' }}>
              {r.name}
            </Typography>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                console.log('APPROVE');
              }}
              startIcon={<MdDone />}
              sx={{
                float: 'right',
                mr: '1%',
                backgroundColor: 'lightgreen',
                fontWeight: 'bold',
              }}
            >
              APPROVE
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                console.log('REJECT');
              }}
              startIcon={<MdClear />}
              sx={{
                float: 'right',
                backgroundColor: '#ff0000ad',
                fontWeight: 'bold',
              }}
            >
              REJECT
            </Button>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  try {
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const routes = await prisma.route.findMany({
      where: {
        approved: false,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      props: {
        routes,
        ...(await serverSideTranslations(context.locale, ['common'])),
      },
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
}

export default Admin;
