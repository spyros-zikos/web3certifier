import React from 'react'
import { Menu, Portal } from '@chakra-ui/react';
import { Button } from "~~/components";


const MyMenu = ({list, listItem, setListItem}: {list: any[], listItem: string, setListItem: any}) => {
    return (
        <Menu.Root>
            <Menu.Trigger>
                <Button my={0} color="white" bgColor="black" borderColor="white" hoverColor="green" hoverBgColor="black" hoverBorderColor="green">
                    {listItem}
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content maxH="120px" minW="10rem" bgColor="lighterBlack">
                        <Menu.RadioItemGroup
                            value={listItem}
                            onValueChange={(e) => setListItem(e.value)}
                        >
                            {list.map((item) => (
                                <Menu.RadioItem key={item} value={item} color="neutral">
                                    {item}
                                    <Menu.ItemIndicator />
                                </Menu.RadioItem>
                            ))}
                        </Menu.RadioItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}

export default MyMenu