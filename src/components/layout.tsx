import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COMMON_STYLES } from '../assets/styles/styleGuide';
import If from './if';

interface ILayoutProps {
    containerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    fixed?: boolean;
    children?: any;
}

const Layout: React.FC<ILayoutProps> = ({
    children,
    containerStyle,
    fixed,
    contentContainerStyle,
}) => {
    return (
        <>
            <If condition={fixed}>
                <View
                    style={[COMMON_STYLES.main, containerStyle]}>
                    {children}
                </View>
            </If>
            <If condition={!fixed}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    style={[COMMON_STYLES.main, containerStyle]}
                    contentContainerStyle={contentContainerStyle}>
                    {children}
                </KeyboardAwareScrollView>
            </If>
        </>
    );
};

export default Layout;
