import React from 'react';
import { useTranslation } from 'react-i18next';
import { Footer, FooterText } from './styled/CommonStyles';

export const AppFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Footer>
      <FooterText>{t('footer.madeWith')}</FooterText>
    </Footer>
  );
};
